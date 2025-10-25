import { test, expect } from '@playwright/test';

test.describe('Post Like Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should like and unlike a post', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/posts/like/count*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 0 }),
      });
    });

    await page.route('**/api/posts/like', async (route) => {
      const request = route.request();
      const body = await request.postDataJSON();
      
      if (body.op === 'like') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, count: 1 }),
        });
      } else if (body.op === 'unlike') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, count: 0 }),
        });
      }
    });

    // Navigate to a post page (assuming you have a post page)
    await page.goto('/posts/0001_hello-world');

    // Find the like button
    const likeButton = page.locator('[data-testid="post-like-button"]');
    const countDisplay = page.locator('[data-testid="like-count"]');

    // Initially should show 0 likes and not be liked
    await expect(countDisplay).toHaveText('0');
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');

    // Click to like
    await likeButton.click();

    // Should show 1 like and be liked
    await expect(countDisplay).toHaveText('1');
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');

    // Click to unlike
    await likeButton.click();

    // Should show 0 likes and not be liked
    await expect(countDisplay).toHaveText('0');
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    // Mock rate limit response
    await page.route('**/api/posts/like', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        headers: {
          'Retry-After': '60',
        },
        body: JSON.stringify({
          success: false,
          error: 'Rate limit exceeded. Please try again in 60 seconds.',
          code: 'RATE_LIMIT_EXCEEDED',
        }),
      });
    });

    await page.goto('/posts/0001_hello-world');

    const likeButton = page.locator('[data-testid="post-like-button"]');
    const errorMessage = page.locator('[data-testid="like-error"]');

    // Click to like
    await likeButton.click();

    // Should show error message
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Rate limit exceeded');
  });

  test('should persist likes in localStorage', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/posts/like/count*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 0 }),
      });
    });

    await page.route('**/api/posts/like', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, count: 1 }),
      });
    });

    await page.goto('/posts/0001_hello-world');

    const likeButton = page.locator('[data-testid="post-like-button"]');

    // Like the post
    await likeButton.click();
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');

    // Check localStorage
    const likedPosts = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('liked_posts') || '[]');
    });

    expect(likedPosts).toContain('0001_hello-world');

    // Refresh the page
    await page.reload();

    // Mock the count API to return 1
    await page.route('**/api/posts/like/count*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 1 }),
      });
    });

    // Should still show as liked
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should handle network errors with rollback', async ({ page }) => {
    // Mock network error
    await page.route('**/api/posts/like', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
      });
    });

    await page.goto('/posts/0001_hello-world');

    const likeButton = page.locator('[data-testid="post-like-button"]');
    const countDisplay = page.locator('[data-testid="like-count"]');

    // Initially 0 likes
    await expect(countDisplay).toHaveText('0');

    // Click to like (should fail)
    await likeButton.click();

    // Should rollback to 0 likes and show error
    await expect(countDisplay).toHaveText('0');
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false');
  });
});
