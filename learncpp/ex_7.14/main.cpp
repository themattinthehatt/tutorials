#include <iostream>
#include <cstdarg> // needed to use ellipsis

double findAverage(int count, ...)
{
    double sum = 0;

    // we access teh ellipsis through a va_list, so let's declare one
    va_list list;

    // we initialize the va_list using va_start. the first parameter is the list
    // to initialize. the second parameter is the last non-ellipsis parameter
    va_start(list, count);

    // loop through all the ellipsis arguments
    for (int arg = 0; arg < count; arg++)
        // we use va_arg to get parameters out of our ellipsis
        // the first parameter is the va_list we're using
        // the second parameter is the type of parameter
        sum += va_arg(list, int);

    // cleanup the va_list when we're done
    va_end(list);

    return sum / count;

}

int main()
{
    std::cout << findAverage(5, 1, 2, 3, 4, 5) << std::endl;
    std::cout << findAverage(6, 1, 2, 3, 4, 5, 6) << std::endl;
    return 0;
}
