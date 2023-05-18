import styles from "./GenericError.module.scss";

interface GenericErrorProps {
  setIsError: (error: boolean) => void;
}

const GenericError: React.FC<GenericErrorProps> = ({ setIsError }) => {
  const reloadPage = () => {
    console.log("Error Happened, Reloading Page...");
    setIsError(false);
  };
  return (
    <div id={styles.error_container}>
      <section id={styles.error_items}>
        <h1>Sorry, theres been an issue!</h1>
        <p>Let's try that again, click reload below.</p>
        <button onClick={() => reloadPage()}>Try Again</button>
      </section>
    </div>
  );
};

export default GenericError;
