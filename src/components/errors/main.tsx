import { Button } from "@mantine/core";

export const MainErrorFallback = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        Ooops, something went wrong :
      </h2>
      <Button
        className="mt-4"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};
