#include <iostream>

int calculateFibonacci(int value)
{
    if (value <= 0)
        return 0;
    else if (value == 1)
        return 1;
    else
        return calculateFibonacci(value-1) + calculateFibonacci(value-2);
}

int main()
{
    for (int i = 0; i < 10; i++)
        std::cout << calculateFibonacci(i) << ' ';
    return 0;
}
