import { Queue } from "../components/Queue";
import { CurrentTrack } from "../components/CurrentTrack";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { BaseLayout } from "../layouts/BaseLayout";

const FrontpagePage = () => {
    const socketRef = useRef();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Ensure the URL includes the /socket.io namespace
        socketRef.current = io(process.env.REACT_APP_SERVER_URL, {
            path: '/socket.io'
        });

        socketRef.current.on("connect", () => {
            setIsConnected(true);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);
    
    return (
        <BaseLayout>
            {isConnected ? (
                <section>
                    <h1 className="text-4xl font-semibold">Queue</h1>
                    {/* bg-gradient-to-b from-yellow-500 to-neutral-800 */}
                    <article className="flex flex-col gap-4 rounded-md">
                        <h2 className="text-2xl text-neutral-400">Now playing</h2>
                        <CurrentTrack socket={socketRef} />
                    </article>

                    <article className="flex flex-col gap-4 rounded-md mt-14">
                        <h2 className="text-2xl text-neutral-400">Next in queue</h2>
                        <Queue socket={socketRef} />
                    </article>{" "}
                </section>
            ) : (
                <div>
                    <p>No connection</p>
                </div>
            )}
        </BaseLayout>
    );
};

export default FrontpagePage;
