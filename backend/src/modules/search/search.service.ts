import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export interface SearchResult {
  id: string;
  score: number;
  highlight?: Record<string, string[]>;
  [key: string]: any;
}

const PG_FTS_TABLES: Record<string, { table: string; columns: string[] }> = {
  goals: { table: 'goals', columns: ['title', 'description', 'category'] },
  groups: { table: 'groups', columns: ['name', 'description'] },
  messages: { table: 'messages', columns: ['content'] },
};

@Injectable()
export class SearchService implements OnModuleInit {
  private es: Client | null = null;
  private esEnabled = false;

  constructor(
    private config: ConfigService,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const url = this.config.get<string>('ELASTICSEARCH_URL');
    if (!url) return;

    this.es = new Client({
      node: url,
      auth: {
        username: this.config.get<string>('ES_USERNAME', ''),
        password: this.config.get<string>('ES_PASSWORD', ''),
      },
    });

    try {
      await this.es.ping();
      this.esEnabled = true;
      await this.createIndices();
    } catch {
      this.esEnabled = false;
      this.es = null;
    }
  }

  async indexDocument(index: string, id: string, body: object): Promise<void> {
    if (!this.esEnabled || !this.es) return;
    await this.es.index({ index, id, document: body }).catch(() => {});
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    if (!this.esEnabled || !this.es) return;
    await this.es.delete({ index, id }).catch(() => {});
  }

  async search(index: string, query: string, filters?: object, size = 20): Promise<SearchResult[]> {
    if (!query?.trim()) return [];

    if (this.esEnabled && this.es) {
      return this.searchElastic(index, query, filters, size);
    }

    return this.searchPostgres(index, query, size);
  }

  private async searchElastic(
    index: string,
    query: string,
    filters?: object,
    size = 20,
  ): Promise<SearchResult[]> {
    const result = await this.es!.search({
      index,
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['title^2', 'name^2', 'description', 'content'],
                fuzziness: 'AUTO',
              },
            },
          ],
          filter: filters ? [{ term: filters }] : [],
        },
      },
      size,
      highlight: { fields: { title: {}, name: {}, content: {} } },
    });

    return result.hits.hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score ?? 0,
      ...(hit._source as object),
      highlight: hit.highlight,
    }));
  }

  private async searchPostgres(
    index: string,
    query: string,
    size: number,
  ): Promise<SearchResult[]> {
    const def = PG_FTS_TABLES[index];
    if (!def) return [];

    const tsVector = def.columns.map((c) => `coalesce("${c}", '')`).join(` || ' ' || `);
    const tsQuery = `plainto_tsquery('simple', $1)`;

    const rows = await this.dataSource.query(
      `SELECT id, ts_rank(to_tsvector('simple', ${tsVector}), ${tsQuery}) AS score, *
       FROM "${def.table}"
       WHERE to_tsvector('simple', ${tsVector}) @@ ${tsQuery}
          OR ${def.columns.map((c) => `"${c}" ILIKE $2`).join(' OR ')}
       ORDER BY score DESC
       LIMIT $3`,
      [query, `%${query}%`, size],
    );

    return rows.map((row: any) => ({ ...row, score: parseFloat(row.score) || 0 }));
  }

  private async createIndices() {
    if (!this.esEnabled || !this.es) return;

    const indices = [
      {
        index: 'goals',
        mappings: {
          properties: {
            title: { type: 'text', analyzer: 'standard' },
            description: { type: 'text' },
            category: { type: 'keyword' },
            memberCount: { type: 'integer' },
            createdAt: { type: 'date' },
          },
        },
      },
      {
        index: 'groups',
        mappings: {
          properties: {
            name: { type: 'text', analyzer: 'standard' },
            description: { type: 'text' },
            goalId: { type: 'keyword' },
            memberCount: { type: 'integer' },
          },
        },
      },
      {
        index: 'messages',
        mappings: {
          properties: {
            content: { type: 'text' },
            chatId: { type: 'keyword' },
            senderId: { type: 'keyword' },
            createdAt: { type: 'date' },
          },
        },
      },
    ];

    for (const { index, mappings } of indices) {
      const exists = await this.es!.indices.exists({ index });
      if (!exists) await this.es!.indices.create({ index, mappings } as any);
    }
  }
}
