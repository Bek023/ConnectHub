import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService implements OnModuleInit {
  private es: Client;

  constructor(private config: ConfigService) {
    this.es = new Client({
      node: config.get<string>('ELASTICSEARCH_URL', 'http://localhost:9200'),
      auth: {
        username: config.get<string>('ES_USERNAME', ''),
        password: config.get<string>('ES_PASSWORD', ''),
      },
    });
  }

  async onModuleInit() {
    if (!this.config.get('ELASTICSEARCH_URL')) return; // MVP: ixtiyoriy
    await this.createIndices().catch((e) => console.error('Elasticsearch init xatosi:', e.message));
  }

  private async createIndices() {
    const indices = [
      {
        index: 'goals',
        body: {
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
      },
      {
        index: 'groups',
        body: {
          mappings: {
            properties: {
              name: { type: 'text', analyzer: 'standard' },
              description: { type: 'text' },
              goalId: { type: 'keyword' },
              memberCount: { type: 'integer' },
            },
          },
        },
      },
      {
        index: 'messages',
        body: {
          mappings: {
            properties: {
              content: { type: 'text' },
              chatId: { type: 'keyword' },
              senderId: { type: 'keyword' },
              createdAt: { type: 'date' },
            },
          },
        },
      },
    ];

    for (const { index, body } of indices) {
      const exists = await this.es.indices.exists({ index });
      if (!exists) await this.es.indices.create({ index, ...body });
    }
  }

  async indexDocument(index: string, id: string, body: object) {
    await this.es.index({ index, id, document: body });
  }

  async search(index: string, query: string, filters?: object, size = 20) {
    const result = await this.es.search({
      index,
      query: {
        bool: {
          must: [
            { multi_match: { query, fields: ['title^2', 'name^2', 'description', 'content'], fuzziness: 'AUTO' } },
          ],
          filter: filters ? [{ term: filters }] : [],
        },
      },
      size,
      highlight: { fields: { title: {}, name: {}, content: {} } },
    });

    return result.hits.hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score,
      ...(hit._source as object),
      highlight: hit.highlight,
    }));
  }

  async deleteDocument(index: string, id: string) {
    await this.es.delete({ index, id });
  }
}
