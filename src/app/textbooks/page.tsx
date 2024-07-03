export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

export default function TextbookList() {
  const textbookNames = [
    "Example math textbook",
    "Example chemistry textbook",
    "Example physics textbook",
  ];
  return (
    <>
      <h1>Available Textbooks:</h1>
      {
        textbookNames.map(name => <h3>{name}</h3>)
      }
    </>
  );
}
