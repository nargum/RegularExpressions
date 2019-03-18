using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models.Tokens
{
    class TRParen : Token
    {
        public TRParen() : base(")")
        {

        }

        public override string getName()
        {
            return "TRParen_";
        }
    }
}