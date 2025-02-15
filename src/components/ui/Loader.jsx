import { MutatingDots } from "react-loader-spinner";

export default function Loader({ height = 100, width = 100, radius = 12.5 }) {
  return (
    <MutatingDots
      visible={true}
      height={height}
      width={width}
      color="#bfa156"
      secondaryColor="#bfa156"
      radius={radius}
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}
