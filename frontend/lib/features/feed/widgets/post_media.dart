import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../../../core/theme/app_spacing.dart';

class PostMedia extends StatelessWidget {
  const PostMedia({super.key, required this.urls});

  final List<String> urls;

  @override
  Widget build(BuildContext context) {
    if (urls.isEmpty) return const SizedBox.shrink();
    if (urls.length == 1) return _SingleImage(url: urls[0]);
    return _ImageGrid(urls: urls);
  }
}

class _SingleImage extends StatelessWidget {
  const _SingleImage({required this.url});

  final String url;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(AppRadius.sm),
      child: CachedNetworkImage(
        imageUrl: url,
        fit: BoxFit.cover,
        width: double.infinity,
        height: 220,
        placeholder: (_, __) => Container(
          height: 220,
          color: Theme.of(context).dividerColor,
        ),
        errorWidget: (_, __, ___) => Container(
          height: 220,
          color: Theme.of(context).dividerColor,
          alignment: Alignment.center,
          child: const Icon(Icons.broken_image_outlined),
        ),
      ),
    );
  }
}

class _ImageGrid extends StatelessWidget {
  const _ImageGrid({required this.urls});

  final List<String> urls;

  @override
  Widget build(BuildContext context) {
    final count = urls.length > 4 ? 4 : urls.length;
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: AppSpacing.space2,
        mainAxisSpacing: AppSpacing.space2,
        childAspectRatio: 1,
      ),
      itemCount: count,
      itemBuilder: (ctx, i) {
        final isLast = i == 3 && urls.length > 4;
        return Stack(
          fit: StackFit.expand,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppRadius.sm),
              child: CachedNetworkImage(
                imageUrl: urls[i],
                fit: BoxFit.cover,
              ),
            ),
            if (isLast)
              ClipRRect(
                borderRadius: BorderRadius.circular(AppRadius.sm),
                child: Container(
                  color: Colors.black54,
                  alignment: Alignment.center,
                  child: Text(
                    '+${urls.length - 4}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}
