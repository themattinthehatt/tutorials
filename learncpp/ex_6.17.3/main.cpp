#include <iostream>

void swapInts(int &a, int &b)
{
    int temp = b;
    b = a;
    a = temp;
}

int main()
{
    int a = 1;
    int b = -1;

    std::cout << "value of a is " << a << std::endl;
    std::cout << "value of b is " << b << std::endl;

    swapInts(a, b);

    std::cout << "value of a is " << a << std::endl;
    std::cout << "value of b is " << b << std::endl;

    return 0;
}
