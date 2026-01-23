"use strict";(()=>{var e={};e.id=9118,e.ids=[9118],e.modules={53524:e=>{e.exports=require("@prisma/client")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},84770:e=>{e.exports=require("crypto")},6005:e=>{e.exports=require("node:crypto")},60564:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>v,requestAsyncStorage:()=>x,routeModule:()=>w,serverHooks:()=>y,staticGenerationAsyncStorage:()=>g});var o={};r.r(o),r.d(o,{POST:()=>m});var s=r(49303),a=r(88716),i=r(60670),n=r(87070),l=r(72331),p=r(96543),d=r(84770),c=r.n(d);let u=p.Ryn({email:p.Z_8().email("Invalid email address")});async function m(e){try{let t=await e.json(),r=u.safeParse(t);if(!r.success)return n.NextResponse.json({error:{code:"VALIDATION_ERROR",message:"Invalid email address",details:r.error.flatten().fieldErrors,timestamp:new Date().toISOString()}},{status:400});let{email:o}=r.data,s=await l._.user.findUnique({where:{email:o}});if(s){let e=c().randomBytes(32).toString("hex"),t=c().createHash("sha256").update(e).digest("hex"),r=new Date(Date.now()+36e5);await l._.passwordResetToken.deleteMany({where:{email:o}}),await l._.passwordResetToken.create({data:{email:o,token:t,expires:r}});try{await h(o,s.name,e)}catch(e){console.error("Failed to send password reset email:",e)}}return n.NextResponse.json({success:!0,message:"If an account exists with that email, you will receive a password reset link shortly."},{status:200})}catch(e){return console.error("Forgot password error:",e),n.NextResponse.json({error:{code:"INTERNAL_ERROR",message:"An error occurred processing your request",timestamp:new Date().toISOString()}},{status:500})}}async function h(e,t,o){let s=process.env.NEXTAUTH_URL||"http://localhost:3000",a=`${s}/auth/reset-password?token=${o}`;if(process.env.RESEND_API_KEY){let{Resend:o}=await r.e(2723).then(r.bind(r,2723)),s=new o(process.env.RESEND_API_KEY);await s.emails.send({from:process.env.EMAIL_FROM||"noreply@extremev.co.za",to:e,subject:"Reset your Extreme V password",html:`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #10b981; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Password Reset Request</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
              <p>Hi ${t},</p>
              <p>We received a request to reset your password for your Extreme V account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${a}" style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
              </div>
              <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="color: #666; font-size: 14px; word-break: break-all;">${a}</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 1 hour.</p>
              <p style="color: #666; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>\xa9 ${new Date().getFullYear()} Extreme V. All rights reserved.</p>
            </div>
          </body>
        </html>
      `})}else console.log("Password Reset URL:",a),console.log("Email is not configured. Set RESEND_API_KEY to enable email sending.")}let w=new s.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/auth/forgot-password/route",pathname:"/api/auth/forgot-password",filename:"route",bundlePath:"app/api/auth/forgot-password/route"},resolvedPagePath:"/Users/almeidajose/Documents/A/App/Extreme V/app/api/auth/forgot-password/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:x,staticGenerationAsyncStorage:g,serverHooks:y}=w,f="/api/auth/forgot-password/route";function v(){return(0,i.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:g})}},72331:(e,t,r)=>{r.d(t,{Z:()=>n,_:()=>i});var o=r(53524);let s=global,a=null;try{a=s.prisma||new o.PrismaClient({log:["error"]})}catch(e){console.warn("Prisma client initialization failed:",e),a=null}let i=a,n=i}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[8948,5972,6543],()=>r(60564));module.exports=o})();