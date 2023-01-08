import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Alert from "../../components/Alert";
import Image from "next/image";
import Pacman from "../../assets/imgs/pacman.svg";

export default function Login() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (session) {
      window.location.href = "/";
    }
  });
  const signInWithEmail = async (event: { preventDefault: () => void }) => {
    setLoading(true);
    event.preventDefault();
    const data = await signIn("email", { email: formEmail, redirect: false });
    if (data && data.error) {
      setTitle("Something when wrong");
      setDescription("Please try again later");
      setShowAlert(true);
    } else {
      setTitle("Check your email");
      setDescription("We sent you a link to sign in");
      setShowAlert(true);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="flex min-h-max flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-50 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    disabled={loading}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  disabled={loading}
                  onClick={signInWithEmail}
                  type="submit"
                  className={
                    "flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" +
                    (loading
                      ? " cursor-not-allowed bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                      : "")
                  }
                >
                  {loading ? (
                    <Image
                      alt={"loading"}
                      src={Pacman}
                      height={20}
                      width={20}
                    ></Image>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div>
                  <button
                    onClick={() => signIn("discord")}
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign in with Discord</span>
                    <svg
                      width="32px"
                      height="32px"
                      viewBox="0 -28.5 256 256"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid"
                      fill="#000000"
                      stroke="#000000"
                      strokeWidth="0"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <path
                            d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                            fill="#5865F2"
                            fillRule="nonzero"
                          ></path>
                        </g>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div>
                  <p className={"text-base text-sm text-gray-500"}>
                    Dont worry if you dont have an account already created, we
                    create one for you when you try to log in with us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Alert
          title={title}
          description={description}
          show={showAlert}
          setShow={setShowAlert}
        ></Alert>
      </div>
    </>
  );
}