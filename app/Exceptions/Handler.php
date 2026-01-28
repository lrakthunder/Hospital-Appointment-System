<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Handle API requests
        if ($request->is('api/*') || $request->expectsJson()) {
            // Validation errors - show the actual validation messages
            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors' => $e->errors()
                ], 422);
            }

            // Model not found
            if ($e instanceof ModelNotFoundException) {
                return response()->json([
                    'message' => 'Resource not found.'
                ], 404);
            }

            // Route not found
            if ($e instanceof NotFoundHttpException) {
                return response()->json([
                    'message' => 'The requested resource was not found.'
                ], 404);
            }

            // HTTP exceptions (4xx, 5xx)
            if ($e instanceof HttpException) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'An error occurred while processing your request.'
                ], $e->getStatusCode());
            }

            // For production, hide detailed error messages
            if (config('app.env') === 'production') {
                return response()->json([
                    'message' => 'An unexpected error occurred. Please try again later.'
                ], 500);
            }

            // For development, show more details
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }

        return parent::render($request, $e);
    }
}
