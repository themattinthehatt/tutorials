#include <iostream>
#include <math.h>

using namespace std;

// modular square root function
double MySqrt(double dX)
{
    if (dX < 0.0)
        throw "Cannot take square root of a negative value";

    return sqrt(dX);
}

int main()
{
    cout << "Please enter a number to take the square root of: ";
    double userInput;
    cin >> userInput;

    try
    {
        cout << "The square root of " << userInput << " is " << MySqrt(userInput) << endl;
    }
    catch (const char *error)
    {
        cout << "Error: " << error << endl;
    }

    return 0;
}
