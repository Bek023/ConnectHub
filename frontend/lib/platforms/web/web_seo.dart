import '_web_seo_stub.dart'
    if (dart.library.html) '_web_seo_web.dart' as impl;

class SeoService {
  static void setMeta({
    required String title,
    required String description,
    String? imageUrl,
    String? url,
  }) {
    impl.setMetaTags(
      title: title,
      description: description,
      imageUrl: imageUrl,
      url: url,
    );
  }

  static void setProfileMeta(String username, String bio, String avatarUrl) {
    setMeta(
      title: '$username | ConnectHub',
      description: bio.length > 160 ? '${bio.substring(0, 157)}...' : bio,
      imageUrl: avatarUrl,
      url: 'https://connecthub.uz/profile/$username',
    );
  }

  static void setPostMeta(String title, String preview, String? mediaUrl) {
    setMeta(
      title: '$title | ConnectHub',
      description: preview,
      imageUrl: mediaUrl,
    );
  }
}
