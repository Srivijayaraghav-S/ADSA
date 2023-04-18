#include <iostream>
#include <string>
#include <cstdlib>
#include <cstdio>
#include <cstring>
#include <unistd.h>
#include <Wt/WApplication>
#include <Wt/WServer>

using namespace Wt;
using namespace std;

void handleInput(const Http::Request &request, Http::Response &response)
{
    string input = request.getParameter("input");
    FILE *fp = popen(("myprogram " + input).c_str(), "r");
    if (!fp)
    {
        response.setStatus(500);
        response.out() << "Error running program";
    }
    else
    {
        char buffer[128];
        string output = "";
        while (fgets(buffer, sizeof(buffer), fp) != NULL)
        {
            output += buffer;
        }
        pclose(fp);
        response.out() << output;
    }
}
