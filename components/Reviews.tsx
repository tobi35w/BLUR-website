'use client';

import { FormEvent, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient, hasSupabaseEnv } from '@/lib/supabase';
import { useReveal } from './useReveal';

type ReviewVoteRow = {
  user_id: string;
};

type ReviewRow = {
  id: string;
  author_name: string;
  rating: number;
  review_text: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  review_votes?: ReviewVoteRow[];
};

type SortOption = 'relevant' | 'newest' | 'highest' | 'lowest';

const emptyForm = {
  authorName: '',
  rating: 5,
  reviewText: '',
};

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'relevant', label: 'Most relevant' },
  { value: 'newest', label: 'Newest' },
  { value: 'highest', label: 'Highest rating' },
  { value: 'lowest', label: 'Lowest rating' },
];

function stars(rating: number) {
  return `${'\u2605'.repeat(rating)}${'\u2606'.repeat(5 - rating)}`;
}

function sortReviews(reviews: ReviewRow[], sortBy: SortOption) {
  const items = [...reviews];

  items.sort((left, right) => {
    const leftHelpful = left.review_votes?.length ?? 0;
    const rightHelpful = right.review_votes?.length ?? 0;
    const leftTime = new Date(left.created_at).getTime();
    const rightTime = new Date(right.created_at).getTime();

    switch (sortBy) {
      case 'highest':
        return right.rating - left.rating || rightTime - leftTime;
      case 'lowest':
        return left.rating - right.rating || rightTime - leftTime;
      case 'newest':
        return rightTime - leftTime;
      case 'relevant':
      default:
        return rightHelpful - leftHelpful || right.rating - left.rating || rightTime - leftTime;
    }
  });

  return items;
}

export default function Reviews() {
  const ref = useReveal();
  const [supabase] = useState(() => getSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevant');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [busyVoteId, setBusyVoteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const currentUserId = session?.user?.id ?? null;
  const displayName =
    typeof session?.user?.user_metadata?.full_name === 'string' && session.user.user_metadata.full_name.trim()
      ? session.user.user_metadata.full_name.trim()
      : typeof session?.user?.user_metadata?.first_name === 'string' &&
          typeof session?.user?.user_metadata?.last_name === 'string'
        ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`.trim()
        : typeof session?.user?.user_metadata?.first_name === 'string'
          ? session.user.user_metadata.first_name
          : 'your account';
  const myReview = currentUserId ? reviews.find((review) => review.user_id === currentUserId) ?? null : null;
  const visibleReviews = sortReviews(reviews, sortBy);
  const totalReviews = reviews.length;
  const averageRating = totalReviews ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;
    return {
      rating,
      count,
      percentage: totalReviews ? (count / totalReviews) * 100 : 0,
    };
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingReviewId(null);
  };

  const loadReviews = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('reviews')
      .select('id, author_name, rating, review_text, created_at, updated_at, user_id, review_votes(user_id)')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    setReviews((data as ReviewRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    loadReviews();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!myReview || editingReviewId) {
      return;
    }

    setForm({
      authorName: myReview.author_name,
      rating: myReview.rating,
      reviewText: myReview.review_text,
    });
  }, [myReview, editingReviewId]);

  const startEditing = () => {
    if (!myReview) {
      return;
    }

    setEditingReviewId(myReview.id);
    setForm({
      authorName: myReview.author_name,
      rating: myReview.rating,
      reviewText: myReview.review_text,
    });
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase || !currentUserId) {
      setError('Log in first to leave a review.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      author_name: form.authorName.trim(),
      rating: form.rating,
      review_text: form.reviewText.trim(),
      user_id: currentUserId,
    };

    const response = editingReviewId
      ? await supabase.from('reviews').update(payload).eq('id', editingReviewId).eq('user_id', currentUserId)
      : await supabase.from('reviews').insert(payload);

    if (response.error) {
      setError(response.error.message);
      setSaving(false);
      return;
    }

    setSuccess(editingReviewId ? 'Review updated successfully.' : 'Review posted successfully.');
    resetForm();
    setSaving(false);
    await loadReviews();
  };

  const handleDelete = async (reviewId: string) => {
    if (!supabase) {
      return;
    }

    setError('');
    setSuccess('');

    const { error: deleteError } = await supabase.from('reviews').delete().eq('id', reviewId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    if (editingReviewId === reviewId) {
      resetForm();
    }

    setSuccess('Review removed.');
    await loadReviews();
  };

  const toggleHelpful = async (reviewId: string, hasVoted: boolean) => {
    if (!supabase || !currentUserId) {
      setError('Log in to mark a review as helpful.');
      return;
    }

    setBusyVoteId(reviewId);
    setError('');
    setSuccess('');

    const response = hasVoted
      ? await supabase.from('review_votes').delete().eq('review_id', reviewId).eq('user_id', currentUserId)
      : await supabase.from('review_votes').insert({ review_id: reviewId, user_id: currentUserId });

    setBusyVoteId(null);

    if (response.error) {
      setError(response.error.message);
      return;
    }

    await loadReviews();
  };

  return (
    <section className="reviews-wrap sec" id="reviews" ref={ref}>
      <div className="section-head reveal">
        <div className="section-label">Community Reviews</div>
        <h2>Reviews</h2>
        <p>
          Show the average rating, star breakdown, helpful votes, and one editable review per signed-in user, all
          backed by Supabase.
        </p>
      </div>

      <div className="reviews-overview reveal">
        <div className="reviews-score-card">
          <div className="reviews-score-value">{totalReviews ? averageRating.toFixed(1) : '0.0'}</div>
          <div className="reviews-score-stars">{stars(Math.round(averageRating || 0))}</div>
          <p>
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        <div className="reviews-breakdown-card">
          {ratingBreakdown.map((item) => (
            <div className="reviews-breakdown-row" key={item.rating}>
              <span>{item.rating}</span>
              <div className="reviews-breakdown-track">
                <div className="reviews-breakdown-fill" style={{ width: `${item.percentage}%` }} />
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </div>

        <div className="reviews-form-card">
          <div className="auth-chip">{myReview ? 'Your review' : 'Write a review'}</div>
          <h3>{session?.user ? `Posting as ${displayName}` : 'Login required to post'}</h3>
          <p className="reviews-helper-text">
            {myReview
              ? 'Google Play style means one review per account. You can edit or delete yours anytime.'
              : 'Signed-in users can post one review, update it later, and mark other reviews as helpful.'}
          </p>

          <form className="reviews-form" onSubmit={handleSubmit}>
            <label>
              <span>Name to display</span>
              <input
                type="text"
                value={form.authorName}
                onChange={(event) => setForm((current) => ({ ...current, authorName: event.target.value }))}
                placeholder="Blur trainee"
                maxLength={40}
                required
              />
            </label>

            <label>
              <span>Star rating</span>
              <div className="reviews-stars-input">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`reviews-star-btn${rating <= form.rating ? ' active' : ''}`}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, rating }))}
                  >
                    {'\u2605'}
                  </button>
                ))}
              </div>
            </label>

            <label>
              <span>Your review</span>
              <textarea
                value={form.reviewText}
                onChange={(event) => setForm((current) => ({ ...current, reviewText: event.target.value }))}
                placeholder="What changed after using BLUR?"
                rows={5}
                maxLength={280}
                required
              />
            </label>

            <div className="reviews-form-actions">
              <button className="auth-submit" type="submit" disabled={saving || !session?.user || !hasSupabaseEnv()}>
                {saving ? 'Saving...' : editingReviewId ? 'Update review' : 'Post review'}
              </button>

              {(editingReviewId || myReview) && (
                <button className="auth-secondary" type="button" onClick={resetForm} disabled={saving}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          {!hasSupabaseEnv() ? <p className="reviews-empty">Add your Supabase env vars to load reviews here.</p> : null}
          {success ? <p className="auth-message">{success}</p> : null}
          {error ? <p className="auth-error">{error}</p> : null}
        </div>
      </div>

      <div className="reviews-list-panel reveal">
        <div className="reviews-header-row">
          <div>
            <div className="auth-chip">Live feed</div>
            <h3>User reviews</h3>
          </div>

          <div className="reviews-toolbar">
            <label className="reviews-sort">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="reviews-refresh" type="button" onClick={loadReviews} disabled={loading || !hasSupabaseEnv()}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="reviews-list">
          {!hasSupabaseEnv() ? <p className="reviews-empty">Add your Supabase env vars to load reviews here.</p> : null}
          {!loading && hasSupabaseEnv() && visibleReviews.length === 0 ? (
            <p className="reviews-empty">No reviews yet. Add the first one.</p>
          ) : null}

          {visibleReviews.map((review) => {
            const helpfulCount = review.review_votes?.length ?? 0;
            const hasVoted = Boolean(review.review_votes?.some((vote) => vote.user_id === currentUserId));
            const isOwnReview = review.user_id === currentUserId;
            const wasEdited = review.updated_at && review.updated_at !== review.created_at;

            return (
              <article className="review-card review-card-rich" key={review.id}>
                <div className="review-top">
                  <div>
                    <div className="review-stars-line">{stars(review.rating)}</div>
                    <strong>{review.author_name}</strong>
                  </div>

                  <div className="review-date-block">
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    {wasEdited ? <small>Edited</small> : null}
                  </div>
                </div>

                <p>{review.review_text}</p>

                <div className="review-footer review-footer-rich">
                  <div className="review-helpful-block">
                    <span>{helpfulCount} found this helpful</span>
                    <button
                      type="button"
                      onClick={() => toggleHelpful(review.id, hasVoted)}
                      disabled={busyVoteId === review.id || !session?.user || isOwnReview}
                    >
                      {hasVoted ? 'Helpful \u2713' : 'Helpful'}
                    </button>
                  </div>

                  {isOwnReview ? (
                    <div className="review-owner-actions">
                      <button type="button" onClick={startEditing}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(review.id)}>
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
