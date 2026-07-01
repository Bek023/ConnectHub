import 'package:web/web.dart' as web;

void setMetaTags({
  required String title,
  required String description,
  String? imageUrl,
  String? url,
}) {
  _setMeta('og:title', title);
  _setMeta('og:description', description);
  _setMeta('twitter:title', title);
  _setMeta('twitter:description', description);
  if (imageUrl != null) {
    _setMeta('og:image', imageUrl);
    _setMeta('twitter:image', imageUrl);
  }
  if (url != null) _setMeta('og:url', url);

  final titleEl = web.document.querySelector('title');
  if (titleEl != null) titleEl.textContent = title;
}

void _setMeta(String property, String content) {
  var el = web.document.querySelector('meta[property="$property"]') ??
      web.document.querySelector('meta[name="$property"]');
  if (el == null) {
    final meta = web.HTMLMetaElement();
    meta.setAttribute('property', property);
    web.document.head!.append(meta);
    el = meta;
  }
  el.setAttribute('content', content);
}
