using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TStar : Token
    {
        public TStar() : base("*")
        {

        }

        public override string getName()
        {
            return "TStar_";
        }
    }
}