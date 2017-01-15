#include <iostream>

int main()
{
    // std::endl inserts a newline character
    std::cout << "Enter a number: ";
    int x = 0;
    std::cin >> x; // read number from console and store it in x
    std::cout << "You entered " << x << std::endl;
    return 0;
}
