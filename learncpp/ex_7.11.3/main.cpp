#include <iostream>

int factorial(int value)
{
    if (value < 1)
        return 1;
    else
        return value * factorial(value-1);
}

int main()
{
    for (int i = 0; i < 7; i++)
        std::cout << factorial(i) << ' ';
    return 0;
}
