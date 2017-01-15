#include "io.h"

int main()
{
    int input1 = readNumber();
    int input2 = readNumber();
    int answer = input1 + input2;
    writeAnswer(answer);
    return 0;
}
