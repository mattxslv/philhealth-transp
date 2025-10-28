import { AlertCircle, RefreshCw, Home, Info } from "lucide-react";
import Link from "next/link";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  type?: "network" | "notfound" | "generic" | "permission";
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "We encountered an error while loading this page.",
  type = "generic",
  onRetry,
  showHomeButton = true,
}: ErrorMessageProps) {
  const errorConfig = {
    network: {
      icon: <AlertCircle className="w-16 h-16 text-red-500" />,
      defaultTitle: "Connection Error",
      defaultMessage: "Unable to load data. Please check your internet connection and try again.",
      suggestions: [
        "Check your internet connection",
        "Refresh the page",
        "Try again in a few moments",
      ],
    },
    notfound: {
      icon: <Info className="w-16 h-16 text-orange-500" />,
      defaultTitle: "Data Not Found",
      defaultMessage: "The requested data could not be found.",
      suggestions: [
        "The data may have been moved or deleted",
        "Check the URL and try again",
        "Return to the homepage",
      ],
    },
    permission: {
      icon: <AlertCircle className="w-16 h-16 text-yellow-500" />,
      defaultTitle: "Access Denied",
      defaultMessage: "You don't have permission to access this resource.",
      suggestions: [
        "Contact support if you believe this is an error",
        "Return to the homepage",
      ],
    },
    generic: {
      icon: <AlertCircle className="w-16 h-16 text-red-500" />,
      defaultTitle: "Something went wrong",
      defaultMessage: "We encountered an unexpected error.",
      suggestions: [
        "Refresh the page to try again",
        "Clear your browser cache",
        "Contact support if the problem persists",
      ],
    },
  };

  const config = errorConfig[type];
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {config.icon}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3">
            {displayTitle}
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            {displayMessage}
          </p>

          {/* Suggestions */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              What you can do:
            </p>
            <ul className="space-y-1.5">
              {config.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
            {showHomeButton && (
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            )}
          </div>

          {/* Support Contact */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-500">
              Need help?{" "}
              <a
                href="mailto:support@philhealth.gov.ph"
                className="text-primary hover:underline"
              >
                Contact PhilHealth Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact error for inline use
export function InlineError({
  message = "Failed to load data",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
            Error
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">
            {message}
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-xs text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
