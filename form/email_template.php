<?php

function renderLeadEmailBody(string $nombre, string $whatsapp, string $ciudad, string $whatsappDigits): string
{
    $nombreSafe = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
    $whatsappSafe = htmlspecialchars($whatsapp, ENT_QUOTES, 'UTF-8');
    $ciudadSafe = htmlspecialchars($ciudad, ENT_QUOTES, 'UTF-8');
    $whatsappHref = 'https://wa.me/' . $whatsappDigits;

    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nuevo lead</title>
</head>
<body style="margin:0; padding:0; background-color:#f2f0f0; font-family: Georgia, 'Times New Roman', serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f0f0; padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#fbf9f8; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <tr>
          <td style="background-color:#1b3022; padding:28px 32px;">
            <p style="margin:0; color:#fdd79b; font-family: Georgia, 'Times New Roman', serif; font-size:13px; letter-spacing:0.08em; text-transform:uppercase;">Landing Dr. Héctor Lagos</p>
            <h1 style="margin:6px 0 0; color:#ffffff; font-family: Georgia, 'Times New Roman', serif; font-size:22px; font-weight:600;">Nuevo lead desde la landing</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 20px; color:#434843; font-family: 'Segoe UI', Arial, sans-serif; font-size:15px; line-height:1.5;">
              Un visitante completó el formulario de contacto. Estos son sus datos:
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:24px;">
              <tr>
                <td style="padding:12px 16px; background-color:#f5f3f3; border-left:3px solid #755a29; font-family: 'Segoe UI', Arial, sans-serif;">
                  <span style="display:block; color:#755a29; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; font-weight:600;">Nombre</span>
                  <span style="display:block; color:#1b1c1c; font-size:16px; margin-top:2px;">{$nombreSafe}</span>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              <tr>
                <td style="padding:12px 16px; background-color:#f5f3f3; border-left:3px solid #755a29; font-family: 'Segoe UI', Arial, sans-serif;">
                  <span style="display:block; color:#755a29; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; font-weight:600;">WhatsApp</span>
                  <span style="display:block; color:#1b1c1c; font-size:16px; margin-top:2px;">{$whatsappSafe}</span>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              <tr>
                <td style="padding:12px 16px; background-color:#f5f3f3; border-left:3px solid #755a29; font-family: 'Segoe UI', Arial, sans-serif;">
                  <span style="display:block; color:#755a29; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; font-weight:600;">Ciudad</span>
                  <span style="display:block; color:#1b1c1c; font-size:16px; margin-top:2px;">{$ciudadSafe}</span>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-radius:9999px; background-color:#1b3022;">
                  <a href="{$whatsappHref}" style="display:inline-block; padding:12px 28px; color:#ffffff; font-family: 'Segoe UI', Arial, sans-serif; font-size:14px; font-weight:600; text-decoration:none; letter-spacing:0.02em;">
                    Responder por WhatsApp
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 32px 24px; border-top:1px solid #e4e2e2;">
            <p style="margin:0; color:#737973; font-family: 'Segoe UI', Arial, sans-serif; font-size:12px;">
              Este correo se generó automáticamente desde el formulario de contacto de la landing.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
}
