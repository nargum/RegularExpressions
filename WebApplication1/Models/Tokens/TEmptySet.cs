using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TEmptySet : Token
    {

        public TEmptySet() : base("#")
        {

        }

        public override string getName()
        {
            return "TEmptySet_";
        }
    }
}