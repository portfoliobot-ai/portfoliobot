interface StyleMatchingStringsProps {
    children: any;
    tags: string[];
    matchedClassName: string;
    caseSensitive?: boolean;
}

/**
 * 
 * @param param0 
 * @returns 
 */
export default function StyleMatchingStrings({
  children: text = "",
  tags = [],
  matchedClassName,
  caseSensitive = false
}: StyleMatchingStringsProps) {
  if (!tags?.length) return text;
  // TODO: This matches text in a string that exists in tags and is in between parentheses
  const matches = [...text.matchAll(new RegExp(tags.map(tag => `\\(${tag}\\)` ).join("|"), "g"))];
  const startText = text.slice(0, matches[0]?.index);

  return (
    <span>
      {startText}
      {matches.map((match, i) => {
        const startIndex = match.index;
        if (startIndex) {
          const currentText = match[0];
          const endIndex = startIndex + currentText.length;
          const nextIndex = matches[i + 1]?.index;
          const untilNextText = text.slice(endIndex, nextIndex);
          return (
            // <span key={i}>
            //     <mark>{currentText}</mark>
            //     {untilNextText}
            // </span>
            <span key={i}>
              <span className={matchedClassName}>{currentText}</span>
              {untilNextText}
            </span>
          );
        }
      })}
    </span>
  );
}