import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

/**
 * Кастомный хук для работы с аутентификацией Supabase.
 * Возвращает текущего пользователя, сессию, статус загрузки и функцию выхода.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Получаем текущую сессию при монтировании
    const fetchSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Ошибка получения сессии:', error.message);
        }

        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Ошибка при инициализации useAuth:', err);
      }
    };

    fetchSession();

    // Подписываемся на изменения состояния аутентификации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔐 Auth state changed:', _event, session?.user?.email);

      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Выход из системы
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Ошибка выхода из системы:', error.message);
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
  };
};
