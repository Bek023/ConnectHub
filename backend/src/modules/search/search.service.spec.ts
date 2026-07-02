import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Client } from '@elastic/elasticsearch';
import { SearchService } from './search.service';

jest.mock('@elastic/elasticsearch', () => ({
  Client: jest.fn().mockImplementation(() => ({
    ping: jest.fn(),
    index: jest.fn(),
    delete: jest.fn(),
    search: jest.fn(),
    indices: {
      exists: jest.fn().mockResolvedValue(true),
      create: jest.fn(),
    },
  })),
}));

describe('SearchService', () => {
  let service: SearchService;
  let dataSource: any;

  const buildModule = async (esUrl: string | undefined) => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, def?: any) => {
              if (key === 'ELASTICSEARCH_URL') return esUrl;
              return def ?? '';
            }),
          },
        },
        {
          provide: DataSource,
          useValue: { query: jest.fn() },
        },
      ],
    }).compile();

    return module;
  };

  describe('when Elasticsearch is disabled (no URL)', () => {
    beforeEach(async () => {
      const module = await buildModule(undefined);
      service = module.get(SearchService);
      dataSource = module.get(DataSource);
      await service.onModuleInit();
    });

    it('indexDocument is a no-op', async () => {
      await expect(
        service.indexDocument('goals', 'id-1', { title: 'Test' }),
      ).resolves.not.toThrow();
    });

    it('deleteDocument is a no-op', async () => {
      await expect(service.deleteDocument('goals', 'id-1')).resolves.not.toThrow();
    });

    it('search falls back to PostgreSQL FTS', async () => {
      dataSource.query.mockResolvedValue([{ id: 'goal-1', title: 'Learn Coding', score: '0.5' }]);

      const results = await service.search('goals', 'coding');

      expect(dataSource.query).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('goal-1');
      expect(results[0].score).toBe(0.5);
    });

    it('returns empty array for unknown index in Postgres fallback', async () => {
      const results = await service.search('unknown_index', 'test');
      expect(results).toEqual([]);
    });

    it('returns empty array for empty query', async () => {
      const results = await service.search('goals', '');
      expect(results).toEqual([]);
      expect(dataSource.query).not.toHaveBeenCalled();
    });

    it('returns empty array for whitespace-only query', async () => {
      const results = await service.search('goals', '   ');
      expect(results).toEqual([]);
    });

    it('searches groups table via postgres', async () => {
      dataSource.query.mockResolvedValue([{ id: 'group-1', name: 'Coders', score: '0.3' }]);

      const results = await service.search('groups', 'coders');

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('"groups"'),
        expect.arrayContaining(['coders']),
      );
      expect(results[0].id).toBe('group-1');
    });

    it('searches messages table via postgres scoped to allowed chats', async () => {
      dataSource.query.mockResolvedValue([{ id: 'msg-1', content: 'hello world', score: '0.1' }]);

      const results = await service.search('messages', 'hello', undefined, 20, ['chat-1']);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('"messages"'),
        expect.arrayContaining(['hello', ['chat-1']]),
      );
      expect(results[0].id).toBe('msg-1');
    });

    it('returns empty message results when user has no chats', async () => {
      const results = await service.search('messages', 'hello');

      expect(results).toEqual([]);
      expect(dataSource.query).not.toHaveBeenCalled();
    });
  });

  describe('when Elasticsearch is enabled but ping fails', () => {
    beforeEach(async () => {
      (Client as unknown as jest.Mock).mockImplementation(() => ({
        ping: jest.fn().mockRejectedValue(new Error('Connection refused')),
        indices: { exists: jest.fn(), create: jest.fn() },
      }));

      const module = await buildModule('http://localhost:9200');
      service = module.get(SearchService);
      dataSource = module.get(DataSource);
      await service.onModuleInit();
    });

    it('falls back to PostgreSQL when ES is unreachable', async () => {
      dataSource.query.mockResolvedValue([{ id: 'goal-1', title: 'Test', score: '0.2' }]);

      const results = await service.search('goals', 'test');

      expect(dataSource.query).toHaveBeenCalled();
      expect(results).toHaveLength(1);
    });
  });

  describe('when Elasticsearch is enabled and reachable', () => {
    let mockEs: any;

    beforeEach(async () => {
      mockEs = {
        ping: jest.fn().mockResolvedValue(true),
        index: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue({}),
        search: jest.fn().mockResolvedValue({
          hits: {
            hits: [
              {
                _id: 'goal-1',
                _score: 1.5,
                _source: { title: 'Learn Go' },
                highlight: { title: ['<em>Learn</em> Go'] },
              },
            ],
          },
        }),
        indices: {
          exists: jest.fn().mockResolvedValue(true),
          create: jest.fn(),
        },
      };
      (Client as unknown as jest.Mock).mockImplementation(() => mockEs);

      const module = await buildModule('http://localhost:9200');
      service = module.get(SearchService);
      dataSource = module.get(DataSource);
      await service.onModuleInit();
    });

    it('indexDocument calls es.index', async () => {
      await service.indexDocument('goals', 'goal-1', { title: 'Learn Go' });
      expect(mockEs.index).toHaveBeenCalledWith({
        index: 'goals',
        id: 'goal-1',
        document: { title: 'Learn Go' },
      });
    });

    it('deleteDocument calls es.delete', async () => {
      await service.deleteDocument('goals', 'goal-1');
      expect(mockEs.delete).toHaveBeenCalledWith({ index: 'goals', id: 'goal-1' });
    });

    it('search uses Elasticsearch and maps results', async () => {
      const results = await service.search('goals', 'learn');

      expect(mockEs.search).toHaveBeenCalled();
      expect(dataSource.query).not.toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('goal-1');
      expect(results[0].score).toBe(1.5);
      expect(results[0].highlight).toBeDefined();
    });
  });
});
