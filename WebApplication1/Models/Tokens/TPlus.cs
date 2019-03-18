using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TPlus : Token
    {
        public TPlus() : base("+")
        {

        }

        public override string getName()
        {
            return "TPlus_";
        }
    }
}