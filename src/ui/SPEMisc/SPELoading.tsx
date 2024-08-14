import { Loader } from "@mantine/core";

export function SPELoading() {
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        opacity: 0.8,
        zIndex: 1000,
        backgroundColor: "white",
      }}
    >
      <Loader />
    </div>
  );
}
