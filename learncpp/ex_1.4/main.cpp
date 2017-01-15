#include <iostream>

void returnNothing()
{
    // This function does not return a value to the caller
}

int return5()
{
    return 5; // This function returns an integer, so a return statement is needed
}

int main()
{
    std::cout << return5() << std::endl;
    std::cout << return5() + 2 << std::endl;

    returnNothing();
    return5(); // function return5() is called, return value is discarded

    return 0;
}
