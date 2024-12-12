import { useState, useEffect, FC } from 'react';

interface TypedTextProps {
  text: string;
  typingSpeed?: number; // задержка между появлением символов (мс)
}

const TypedText: FC<TypedTextProps> = ({ text, typingSpeed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0); // Сбрасываем индекс при смене текста
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, typingSpeed);

      return () => clearTimeout(timeoutId);
    }
  }, [index, text, typingSpeed]);

  return <>{displayedText}</>;
};

export default TypedText;
