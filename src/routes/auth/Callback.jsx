import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

/**
 * FRONTEND_POST_LOGIN_URL lands here after a social sign-in. The URL is clean —
 * there is no token in the query string or fragment. The refresh cookie is
 * already set, so we exchange it for an access token and move on.
 */
export default function Callback() {
  const { bootstrap } = useAuth();
  const navigate = useNavigate();
  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    bootstrap().then((ok) => {
      if (ok) navigate("/", { replace: true });
      else setFailed(true);
    });
  }, [bootstrap, navigate]);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      {failed ? (
        <Card className="w-full max-w-md p-8">
          <h1 className="font-display text-2xl font-medium text-ink">
            That didn't go through
          </h1>
          <div className="mt-5">
            <Alert>
              Sign-in didn't complete. This usually means cookies were blocked or
              the tab went stale.
            </Alert>
          </div>
          <Button to="/login" fullWidth size="lg" className="mt-6">
            Try signing in again
          </Button>
        </Card>
      ) : (
        <Spinner label="Finishing sign-in…" />
      )}
    </div>
  );
}
