#include <iostream>

class Stack
{
private:
    static const int max_val = 10;
    int values[max_val];
    int len = 0;

public:
    void reset()
    {
        for (int i = 0; i < len; i++)
            values[i] = 0;

        len = 0;
    }

    bool push(int new_val)
    {
        if (len < max_val)
        {
            values[len++] = new_val;
            return true;
        }
        else
            return false;
    }

    int pop()
    {
        if (len == 0)
            return -1;
        else
            return values[len--];
    }

    void print()
    {
        std::cout << "( ";
        for (int i = 0; i < len; i++)
            std::cout << values[i] << " ";
        std::cout << ")" << std::endl;
    }

};

int main()
{
    Stack stack;

    stack.reset();
    stack.print();

    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    stack.push(5);
    stack.push(6);
    stack.push(7);
    stack.print();

    stack.pop();
    stack.print();

    stack.pop();
    stack.pop();
    stack.print();

    stack.push(8);
    stack.push(9);
    stack.push(10);
    stack.push(11);
    stack.print();

    return 0;
}
