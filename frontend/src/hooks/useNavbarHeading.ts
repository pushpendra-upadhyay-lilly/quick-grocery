import { useEffect } from 'react';
import { useNavbarStore } from '../stores/navbarStore';

export function useNavbarHeading(heading: string, subHeading: string | null = null) {
  const setCustomHeading = useNavbarStore((s) => s.setCustomHeadings);

  useEffect(() => {
    setCustomHeading(heading, subHeading);

    // Cleanup: reset heading when component unmounts
    return () => {
      setCustomHeading(null, null);
    };
  }, [heading, subHeading, setCustomHeading]);
}
