#include <iostream>

double getDouble()
{
    while(1)
    {
        std::cout << "Enter a double value: ";
        double x;
        std::cin >> x;

        if (std::cin.fail()) // has a previous extraction failed?
        {
            // yep, so lets handle the failure
            std::cin.clear(); // put us back in the 'normal' operation mode
            std::cin.ignore(32767, '\n'); // clear (up to 32767) characters out of the
                                      // buffer until a '\n' character is removed
            std::cout << "Oops, that input is invalid. Please try again.\n";
        }
        else
        {
            // nope, so return out good x
            std::cin.ignore(32767, '\n'); // remove extraneous input
            return x;
        }
    }
}

char getOperator()
{
    while (1) // Loop until user enters a valid input
    {
        std::cout << "Enter one of the following: +, -, *, or /: ";
        char op;
        std::cin >> op;
        std::cin.ignore(32767, '\n'); // Chars can accept any single input char,
                                      // so we need to check for invalid extract

        // check whether the user entered meaningful input
        if (op == '+' || op == '-' || op == '*' || op == '/')
            return op;
        else
            std::cout << "Oops, that input is invalid. Please try again\n";
    }
}

void printResult(double x, char op, double y)
{
    if (op == '+')
        std::cout << x << " + " << y << " is " << x + y << '\n';
    else if (op == '-')
        std::cout << x << " - " << y << " is " << x - y << '\n';
    else if (op == '*')
        std::cout << x << " * " << y << " is " << x * y << '\n';
    else if (op == '/')
        std::cout << x << " / " << y << " is " << x / y << '\n';
    else
        std::cout << "Something went wrong: printResult() got an invalid operator.";
}

int main()
{
    double x = getDouble();
    char op = getOperator();
    double y = getDouble();

    printResult(x, op, y);

    return 0;
}
