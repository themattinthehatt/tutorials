#include <iostream>

int main()
{
    int value = 5;
    int &ref = value;

    value = 6;
    std::cout << value << std::endl;
    std::cout << ref << std::endl;
    std::cout << std::endl;

    ref = 7;
    std::cout << value << std::endl;
    std::cout << ref << std::endl;
    std::cout << std::endl;

    ref++;
    std::cout << value << std::endl;
    std::cout << ref << std::endl;
    std::cout << std::endl;

    return 0;
}
