export default function NoData({ className, text = 'No data now!' }) {
  return <div className={`text-center my-6 ${className}`}>{text}</div>;
}
