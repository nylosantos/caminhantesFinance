import { Vortex } from "react-loader-spinner";

type SubmitLoadingProps = {
  isSubmitting: boolean;
  whatsGoingOn: string;
  isNotFullScreen?: boolean;
};

export function SubmitLoading({
  isSubmitting,
  whatsGoingOn,
  isNotFullScreen = false,
}: SubmitLoadingProps) {
  return (
    <>
      {isSubmitting ? (
        isNotFullScreen ? (
          <div className="flex flex-col items-center p-6 rounded-3xl bg-transparent">
            <Vortex
              visible={true}
              height="80"
              width="80"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={["red", "green", "blue", "yellow", "orange", "purple"]}
            />
            <h1 className="text-xl text-white mb-3">
              Aspettare, {whatsGoingOn}...
            </h1>
          </div>
        ) : (
          <div className="flex flex-col fixed w-screen h-screen top-0 left-0 items-center justify-center bg-transparent transition-all duration-300 z-50">
            {/* SUBMIT LOADING CARD */}
            <div className="flex flex-col items-center p-6 rounded-3xl bg-klGreen-500 dark:bg-klGreen-500">
              <Vortex
                visible={true}
                height="80"
                width="80"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={["red", "green", "blue", "yellow", "orange", "purple"]}
              />
              <h1 className="text-xl text-white mb-3">
                Aspettare, {whatsGoingOn}...
              </h1>
            </div>
          </div>
        )
      ) : null}
    </>
  );
}
