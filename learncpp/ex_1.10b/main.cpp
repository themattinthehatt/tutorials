#include <iostream>

int getUserInput()
{
    std::cout << "Please enter an integer: ";
    int value;
    std::cin >> value;
    return value;
}

int getMathematicalOperation()
{
    std::cout << "Please enter which operator you want: " << std::endl;
    std::cout << "1 = +" << std::endl;
    std::cout << "2 = -" << std::endl;
    std::cout << "3 = *" << std::endl;
    std::cout << "4 = /" << std::endl;
    std::cout << ">> ";

    int op;
    std::cin >> op; // No error checking for now
    return op;
}

int calculateResult(int x, int op, int y)
{
    // note: we need to use if statements here because there's no direct way
    // to convert op to the appropriate operator

    if (op == 1)
        return x + y;
    if (op == 2)
        return x - y;
    if (op == 3)
        return x * y;
    if (op == 4)
        return x / y;

    return -1; // default "error" value in case user passed an invalid op
    // note: this isn't a good way to handle errors, since -1 could be returned
    // as a legitimate value
}

void printResult(int result)
{
    std::cout << "Your result is: " << result << std::endl;
}

int main()
{
    int input1 = getUserInput();
    int op = getMathematicalOperation();
    int input2 = getUserInput();
    int result = calculateResult(input1, op, input2);
    printResult(result);
    return 0;
}
