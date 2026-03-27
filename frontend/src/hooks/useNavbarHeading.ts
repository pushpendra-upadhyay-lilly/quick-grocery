import { useEffect } from 'react';
import { useNavbarStore } from '../stores/navbarStore';

export function useNavbarHeading(heading: string) {
  const setCustomHeading = useNavbarStore((s) => s.setCustomHeading);

  useEffect(() => {
    setCustomHeading(heading);

    // Cleanup: reset heading when component unmounts
    return () => {
      setCustomHeading(null);
    };
  }, [heading, setCustomHeading]);
}
