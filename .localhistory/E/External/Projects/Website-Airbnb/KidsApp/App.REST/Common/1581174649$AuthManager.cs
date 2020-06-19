using App.Entity.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;

namespace App.REST.Common
{
    public class AuthManager
    {
        private const string Secret = "db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==";

        public static string GenerateToken(User user, int expireMinutes = 10000)
        {
            var symmetricKey = Convert.FromBase64String(Secret);
            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.UtcNow;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                  new Claim("Id",user.Id.ToString()),
                  new Claim("Email",user.Email),
                  new Claim("IsSupplier",user.IsSupplier.ToString()),
                  new Claim("UserType",user.UserType.ToString()),
                  //new Claim("FullNameAr",user.FullNameAr),
                  //new Claim("FullNameEn",user.FullNameEn),
                  //new Claim("PositionAr",user.PositionAr),
                  //new Claim("PositionEn",user.PositionEn),
                  //new Claim("Image",user.Image)
                }),

                Expires = now.AddMinutes(Convert.ToInt32(expireMinutes)),

                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(symmetricKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(stoken);

            return token;
        }


        public static ClaimsPrincipal GetPrincipal(string token)
        {
            try
            {
                string localtoken = token.Split(new char[] { ' ' })[1];
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadToken(localtoken) as JwtSecurityToken;

                if (jwtToken == null)
                    return null;

                var symmetricKey = Convert.FromBase64String(Secret);

                var validationParameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    IssuerSigningKey = new SymmetricSecurityKey(symmetricKey)
                };

                SecurityToken securityToken;
                var principal = tokenHandler.ValidateToken(localtoken, validationParameters, out securityToken);

                return principal;
            }
            catch (Exception)
            {
                //should write log
                return null;
            }
        }

        public static bool ValidateToken(string token, out User user)
        {
            user = new User();

            var simplePrinciple = AuthManager.GetPrincipal(token);
            var identity = simplePrinciple.Identity as ClaimsIdentity;

            if (identity == null)
                return false;

            if (!identity.IsAuthenticated)
                return false;


            user.Id = int.Parse(identity.FindFirst("Id")?.Value);
            user.Email = identity.FindFirst("Email")?.Value;
            user.IsSupplier = Convert.ToBoolean(identity.FindFirst("IsSupplier")?.Value);
            user.UserType = (Entity.SharedEnums.UserTypes)int.Parse(identity.FindFirst("UserType")?.Value.ToString());
            //user.FullNameAr = identity.FindFirst("FullNameAr")?.Value;
            //user.FullNameEn = identity.FindFirst("FullNameEn")?.Value;
            //user.PositionAr = identity.FindFirst("PositionAr")?.Value;
            //user.PositionEn = identity.FindFirst("PositionEn")?.Value;
            //user.Image = identity.FindFirst("Image")?.Value;


            if (string.IsNullOrEmpty(user.Email))
                return false;

            // More validate to check whether username exists in system

            return true;
        }

        public static Task<IPrincipal> AuthenticateJwtToken(string token)
        {
            User user;

            if (AuthManager.ValidateToken(token, out user))
            {
                // based on username to get more information from database 
                // in order to build local identity
                var claims = new List<Claim>
                {
                    new Claim("Email", user.Email)
                    // Add more claims if needed: Roles, ...
                };

                var identity = new ClaimsIdentity(claims, "Jwt");
                IPrincipal user2 = new ClaimsPrincipal(identity);

                return System.Threading.Tasks.Task.FromResult(user2);
            }

            return System.Threading.Tasks.Task.FromResult<IPrincipal>(null);
        }
    }
}