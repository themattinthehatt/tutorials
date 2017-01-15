#include <iostream>

int readNumber()
{
    std::cout << "Please enter an integer: ";
    int input;
    std::cin >> input;
    return input;
}

void writeAnswer(int answer)
{
    std::cout << answer << std::endl;
}
