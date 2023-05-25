import styles from "./LoadingIndicator.module.scss";

interface LoadingIndicatorProps {
  loadingMessage: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  loadingMessage,
}) => {
  return (
    <div id={styles.loading}>
      <img src="/loading.gif" alt="Loading" />
      <h2>{loadingMessage}</h2>
    </div>
  );
};

export default LoadingIndicator;
