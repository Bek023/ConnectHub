import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'profile_model.dart';
import 'profile_repository.dart';

part 'profile_provider.g.dart';

@Riverpod(keepAlive: true)
class MyProfile extends _$MyProfile {
  @override
  Future<ProfileModel> build() async {
    return ref.read(profileRepositoryProvider).getMyProfile();
  }

  Future<void> saveProfile({
    String? displayName,
    String? bio,
    String? avatarUrl,
  }) async {
    final current = state.valueOrNull;
    if (current == null) return;

    state = AsyncData(current.copyWith(
      displayName: displayName ?? current.displayName,
      bio: bio ?? current.bio,
      avatarUrl: avatarUrl ?? current.avatarUrl,
    ));

    try {
      final updated = await ref.read(profileRepositoryProvider).updateProfile(
            displayName: displayName,
            bio: bio,
            avatarUrl: avatarUrl,
          );
      state = AsyncData(updated);
    } catch (_) {
      state = AsyncData(current);
      rethrow;
    }
  }
}

@riverpod
class PublicProfile extends _$PublicProfile {
  @override
  Future<ProfileModel> build(String userId) async {
    return ref.read(profileRepositoryProvider).getUserById(userId);
  }
}
