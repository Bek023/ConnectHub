import 'package:sembast/sembast.dart';

import '_sembast_factory_stub.dart'
    if (dart.library.io) '_sembast_factory_io.dart'
    if (dart.library.html) '_sembast_factory_web.dart';

abstract class LocalDbService {
  Future<void> init();
  Future<void> saveMessages(
    List<Map<String, dynamic>> messages,
    String chatId,
  );
  Future<List<Map<String, dynamic>>> getMessages(String chatId);
  Future<void> clearAll();
}

class SembastDbService implements LocalDbService {
  Database? _db;

  @override
  Future<void> init() async {
    _db = await openDb();
  }

  StoreRef<String, Map<String, dynamic>> _store(String chatId) =>
      stringMapStoreFactory.store('chat_$chatId');

  @override
  Future<void> saveMessages(
    List<Map<String, dynamic>> messages,
    String chatId,
  ) async {
    final db = _db;
    if (db == null) return;
    final store = _store(chatId);
    await db.transaction((txn) async {
      for (final msg in messages) {
        await store.record(msg['id'] as String).put(txn, msg);
      }
    });
  }

  @override
  Future<List<Map<String, dynamic>>> getMessages(String chatId) async {
    final db = _db;
    if (db == null) return [];
    final store = _store(chatId);
    final records = await store.find(db);
    return records.map((r) => r.value).toList();
  }

  @override
  Future<void> clearAll() async {
    await _db?.close();
    _db = null;
  }
}

LocalDbService createLocalDb() => SembastDbService();
