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
