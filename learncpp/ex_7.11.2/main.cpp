#include <iostream>

int calculateFibonacci(int value)
{
    if (value <= 0)
        return 0;
    else if (value == 1)
        return 1;
    else
    {
        int fn_1 = 1;
        int fn_2 = 0;
        int fn = 1;
        for (int i = 2; i <= value; i++)
        {
            fn = fn_1 + fn_2;
            fn_2 = fn_1;
            fn_1 = fn;
        }
        return fn;
    }
}

int main()
{
    for (int i = 0; i < 10; i++)
        std::cout << calculateFibonacci(i) << ' ';
    return 0;
}
