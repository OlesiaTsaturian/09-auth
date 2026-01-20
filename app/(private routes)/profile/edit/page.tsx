'use client';

import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { useEffect, useState } from 'react';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getMe();
        if (!isMounted) return;
        setUsername(data.username ?? '');
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancelBtn = () => {
    router.push('/profile');
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) return;

    try {
      setIsSaving(true);
      const updatedUser = await updateMe({ username: trimmed });
      setUser(updatedUser);
      router.push('/profile');
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || '/user-avatar-logo.svg'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSaveUser}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              name="username"
              placeholder="Your name"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={isSaving}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isSaving || username.trim().length === 0}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancelBtn}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
