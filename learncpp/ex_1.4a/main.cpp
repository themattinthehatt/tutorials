#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int multiply(int w, int z)
{
    return w * z;
}

int main()
{
    using std::cout;
    using std::endl;

    cout << add(4, 5) << endl;
    cout << multiply(2, 3) << endl;

    // We can pass the value of expressions
    cout << add(1 + 2, 3 * 4) << endl;

    // We can pass the value of variables
    int a = 5;
    cout << add(a, a) << endl;

    // We can pass the outputs of other functions
    cout << add(1, multiply(2, 3)) << endl;
    cout << add(1, add(2, 3)) << endl;

    return 0;
}
