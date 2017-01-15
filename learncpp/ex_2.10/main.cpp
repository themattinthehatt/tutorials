#include <iostream>
#include "constants.h"

double getInitialHeight()
{
    double height;
    std::cout << "Enter initial height in meters: ";
    std::cin >> height;
    return height;
}

void calculateHeight(double init_height, double time)
{
    using std::cout;
    using std::endl;

    double x = init_height - 0.5 * myConstants::g * time * time;
    if (x > 0.0)
        cout << "At " << time << " seconds, the ball is at height: " <<
                x << " meters." << endl;
    else
        cout << "At " << time << " seconds, the ball is on the ground." << endl;

}

int main()
{
    double init_height = getInitialHeight();
    calculateHeight(init_height, 0.0);
    calculateHeight(init_height, 1.0);
    calculateHeight(init_height, 2.0);
    calculateHeight(init_height, 3.0);
    calculateHeight(init_height, 4.0);
    calculateHeight(init_height, 5.0);
}
