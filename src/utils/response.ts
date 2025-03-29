import HttpException from './exceptions/http.exception';

export type ErrorResponseData<T extends any = undefined> = {
    status: number;
    message: string;
    error?: T;
};

export function createErrorResponse(
    error: HttpException | Error
): ErrorResponseData;
export function createErrorResponse<T extends any = undefined>(
    message: string,
    status: number,
    error?: T
): ErrorResponseData<T>;
export function createErrorResponse<T extends any = undefined>(
    ...args: (HttpException | Error | string | number | T)[]
): ErrorResponseData<T> {
    if (args.length === 1) {
        let error =
            args[0] instanceof HttpException
                ? args[0]
                : new HttpException(args[0] as Error);
        return {
            status: error.status,
            message: error.message,
        };
    }

    return {
        message: args[0] as string,
        status: args[1] as number,
        error: args[2] as T | undefined,
    };
}

export function createSuccessResponse<T>(
    message: string = 'Success',
    status: number = 200,
    data?: T
) {
    return {
        message,
        status,
        data,
    };
}
